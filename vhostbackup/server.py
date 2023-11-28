# Server used for managing backups and restores
# 
# To view backups access: http://vhostbackup.localhost/
# To create a backup access: http://vhostbackup.localhost/backup
# To restore a backup access: http://vhostbackup.localhost/restore
# Example: http://vhostbackup.localhost/restore?ID=20231126143610896993&timestamp=2023-11-26%2014:36:10&list=vhost1,vhost2,api
# To view current backup config: http://vhostbackup.localhost/getConfig
# To change (override) current backup config: http://vhostbackup.localhost/setConfig
# Example: http://vhostbackup.localhost/setConfig?ContainerList=vhost1,vhost2,api&ContainerExceptionList=caddy,vhostbackup

# Import all dependencies
from crypt import methods
from flask import Flask, request, jsonify
from datetime import datetime
import docker
import json
import os
import yaml

app = Flask(__name__)

# Return current date and time
def getDate():
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    return current_time

# Return current date and time
def getNewID():
    now = datetime.now()
    newBackupID = now.strftime("%Y%m%d%H%M%S%f")
    return newBackupID

# Checks backup file and returns completed backups
def getBackupsRestoreLogs():
    fileOpened = False
    responseText = ""

    # Try reading the file - if file can't be opened it means that it's corrupt and according message is showed
    try:
        logFile = open("/opt/backup/backupRestoreLog.txt", "r")
        fileOpened = True
    except:
        responseText = statusCodeToJSON("404","Log file was not found! Please create first backup.")

    if(fileOpened):
        responseText = logFile.read()
        logFile.close()

    return jsonify(data=responseText)

# Creates backup/restore log from provided infromation and return completion status      
def createBackupRestoreLog(backupRestoreLogData):
    try:
        backupLog = open('/opt/backup/backupRestoreLog.txt' , 'a')
        backupLog.write(str(backupRestoreLogData) + '\n')
        backupLog.close()
        return True
    except:
        return False

# Creates JSON response code for inputed status code and reason
def statusCodeToJSON(statusCode, StatusReason):
    statusResponseBuild = {
        "Status": str(statusCode),
        "StatusReason": str(StatusReason)
    }
    return json.dumps(statusResponseBuild)

# Gets current configuration infromation and returns it
def getConfigAll():
    fileOpened = False
    responseText = ""

    # Try reading the file - if file can't be opened it means that it's corrupt and according message is showed
    try:
        configFile = open("/opt/backup/configFile.txt", "r")
        fileOpened = True
    except:
        responseText = statusCodeToJSON("404","Configuration file was not found! Please create one first.")

    if(fileOpened):
        responseText = configFile.read()
        configFile.close()

    return responseText

# Gets current configuration infromation for one item and returns it
def getConfig(value):
    fileOpened = False
    responseText = ""

    # Try reading the file - if file can't be opened it means that it's corrupt and according message is showed
    try:
        configFile = open("/opt/backup/configFile.txt", "r")
        fileOpened = True
    except:
        responseText = False

    if(fileOpened):
        configItems = json.loads(configFile.read())
        configFile.close()

        if(value == "ContainerList"):
            responseText = configItems["ContainerList"]
        elif(value == "ContainerExceptionList"):
            responseText = configItems["ContainerExceptionList"]
        else:
            responseText = False

    if(responseText != False):
        responseText = responseText.split(",")

    return responseText

# Creates backup/restore log from provided infromation and return completion status      
def setConfig(containerList, containerExceptionList):
    # Set starting variables
    startTimestamp = getDate()
    configChangeID = str(getNewID())
    outcome = "FAILED"
    
    configDataBuild = {
        "ContainerList": str(containerList),
        "ContainerExceptionList": str(containerExceptionList)
    }
    configData = json.dumps(configDataBuild)

    try:
        configFile = open('/opt/backup/configFile.txt' , 'w')
        configFile.write(str(configData))
        configFile.close()
        outcome = "COMPLETED"
    except:
        outcome = "FAILED"

    # building response and log information
    configChangeLogBuild = {
        "ID": str(configChangeID),
        "Type": "BACKUP CONFIG CHANGE",
        "Status": str(outcome),
        "StatusReason": "Changed to: " + str(configData),
        "Started": str(startTimestamp),
        "Completed": str(getDate())
    }
    configChangeLog = json.dumps(configChangeLogBuild)
    
    # Logs backup
    createBackupRestoreLog(configChangeLog)

    if(outcome == "COMPLETED"):
        return True
    else:
        return False

# Creates backup of defined containers
def backupContainers(backupID, timestamp):
    containerList = getConfig("ContainerList")
    completedSteps = 0
    volumepath = "/opt/backup/"

    try:
        client = docker.from_env()
    except:
        return 0

    for name in containerList:
        try:
            container = client.containers.get(name)
            tag = str(timestamp).replace(" ", "").replace("-", "").replace(":", "")
            image = container.commit(repository="dockerbackup_"+name, tag=tag, message=str(backupID))
            with open(os.path.join(volumepath, f"{backupID}_{name.upper()}.tar"), 'wb') as f:
                for chunk in image.save(chunk_size=2048):
                    f.write(chunk)
            completedSteps += 1
        except:
            return 0

    return completedSteps

# Restores a specified container from backup
def restoreContainer(backupid, timestamp, name):
    volumepath = "/opt/backup/"
    compose_file = "/tmp/docker-compose.yml"

    try:
        client = docker.from_env()
    except:
        return False

    
    try:
        with open(os.path.join(volumepath, f"{backupid}_{name.upper()}.tar"), 'rb') as f:
            client.images.load(f.read())
        if name in [container.name for container in client.containers.list()]:
            container = client.containers.get(name)
            container.stop()
            container.remove()
        tag = str(timestamp).replace(" ", "").replace("-", "").replace(":", "")
        imageName = "dockerbackup_"+name+":"+tag

            # Load the Docker Compose file
        with open(compose_file, 'r') as file:
            compose_dict = yaml.safe_load(file)

        # Get the configuration for the specific service
        service_config = compose_dict['services'][name]

        # Run the container with the configuration from the Docker Compose file
        container = client.containers.run(imageName, detach=True, name=name)

        if 'ports' in service_config:
            ports = service_config.pop('ports')
            port_bindings = {}
            for port in ports:
                host_port, container_port = port.split(':')
                container_port = int(container_port)
                host_port = int(host_port)
                port_bindings[container_port] = host_port
            if port_bindings:
                container.stop()
                container.remove()
                container = client.containers.run(imageName, detach=True, name=name, ports=port_bindings)

        if 'networks' in service_config:
            networks = service_config.pop('networks')
            for network_name in networks:
                network = client.networks.get("virtualizacijos_projektas_"+network_name)
                network.connect(container)
        return True
    except:
        return False

# Performs all restoration process steps (performs restore and logs actions)
def restoreBackup(restoreBackupID, restoreBackupTimestamp, restoreContainerList):
    # Set starting variables
    startTimestamp = getDate()
    restoreID = str(getNewID())
    status = "STARTED"
    statusReason = ""
    statusReasonAdditional = ""
    statusNoErrors = True
    totalLenght = len(restoreContainerList)
    completedLenght = 0

    # Runs all backup codes
    # Calls container restore code and logs status of it
    for name in restoreContainerList:
        if (name in getConfig("ContainerExceptionList")):
            statusReasonAdditional += "FAILED: You are not allowed to restore " + str(name)
            statusNoErrors = False
            totalLenght -= 1
        else:
            containerRestoreDone = restoreContainer(restoreBackupID, restoreBackupTimestamp, name)
            if (containerRestoreDone == False):
                statusReasonAdditional += "FAILED: Container " + str(name) + " restore;"
                statusNoErrors = False
            else:
                completedLenght += 1

    # sets current progress
    statusReason = "DONE: " + str(completedLenght) + "/" + str(totalLenght)

    # check if backups completed and set status
    if(statusNoErrors):
        status = "COMPLETED"
    else:
        status = "FAILED"
        statusReason += statusReasonAdditional


    # building response and log information
    backupResponseBuild = {
        "ID": str(restoreID),
        "Type": "RESTORE (" + restoreBackupID + ")",
        "Status": str(status),
        "StatusReason": str(statusReason),
        "Started": str(startTimestamp),
        "Completed": str(getDate())
    }
    backupResponse = json.dumps(backupResponseBuild)
    
    # Logs backup
    if (createBackupRestoreLog(backupResponse)):
        return backupResponse
    else:
        # In case we get an error while saving a log a warning message is return with a reason to the caller
        backupResponseBuild["Status"] = "WARNING"
        backupResponseBuild["StatusReason"] = "Failed to create backup log"
        backupResponse = json.dumps(backupResponseBuild)
        return backupResponse

# Performs all backup process steps (creates backup, logs actions)
def createBackup():
    # Set starting variables
    startTimestamp = getDate()
    backupID = str(getNewID())
    status = "STARTED"
    statusReason = ""
    containerList = getConfig("ContainerList")
    totalLenght = 0
    completedLenght = 0
    
    if(containerList != False):
        totalLenght = len(containerList)

        # Runs all backup codes
        # Calls ontainer backup code and logs status of it
        containerBackupDone = backupContainers(backupID, startTimestamp)
        completedLenght = containerBackupDone

        # sets current progress
        statusReason = "DONE: " + str(completedLenght) + "/" + str(totalLenght)
        # check if backups completed and set status
        if(completedLenght == totalLenght):
            status = "COMPLETED"
        else:
            status = "FAILED"
            statusReason += "; FAILED: Container backup"
    else:
        status = "FAILED"
        statusReason = "No configuration for container backup"

    # building response and log information
    backupResponseBuild = {
        "ID": str(backupID),
        "Type": "BACKUP",
        "Status": str(status),
        "StatusReason": str(statusReason),
        "Started": str(startTimestamp),
        "Completed": str(getDate())
    }
    backupResponse = json.dumps(backupResponseBuild)
    
    # Logs backup
    if (createBackupRestoreLog(backupResponse)):
        return backupResponse
    else:
        # In case we get an error while saving a log a warning message is return with a reason to the caller
        backupResponseBuild["Status"] = "WARNING"
        backupResponseBuild["StatusReason"] = "Failed to create backup log"
        backupResponse = json.dumps(backupResponseBuild)
        return backupResponse

# This code is executed once http://vhostbackup.localhost/ is called
@app.route('/', methods = ['GET'])
def backupViewLog():
    if(request.method == 'GET'):
        return getBackupsRestoreLogs()

# This code is executed once http://vhostbackup.localhost/backup is called
@app.route('/backup', methods = ['GET'])
def backupNow():
    if(request.method == 'GET'):
        createBackupResponse = createBackup()
        return createBackupResponse

# This code is executed once http://vhostbackup.localhost/restore is called
@app.route('/restore', methods = ['GET'])
def restoreNow():
    if(request.method == 'GET'):
        # Accessing parameters passed in the URL
        restoreBackupID = request.args.get('ID')
        restoreBackupTimestamp = request.args.get('timestamp')
        restoreContainerList = str(request.args.get('list')).split(",")

        if(restoreBackupID == None or restoreBackupTimestamp == None or restoreContainerList == None):
            return statusCodeToJSON("400","Missing required parameters")
        
        retoreBackupResponse = restoreBackup(restoreBackupID, restoreBackupTimestamp, restoreContainerList)
        return retoreBackupResponse

# This code is executed once http://vhostbackup.localhost/getConfig is called
@app.route('/getConfig', methods = ['GET'])
def backupGetConfig():
    if(request.method == 'GET'):
        getConfigResponse = getConfigAll()
        return getConfigResponse

# This code is executed once http://vhostbackup.localhost/setConfig is called
@app.route('/setConfig', methods = ['GET'])
def backupSetConfig():
    if(request.method == 'GET'):
        # Accessing parameters passed in the URL
        containerList = request.args.get('ContainerList')
        containerExceptionList = request.args.get('ContainerExceptionList')

        if(containerList == None or containerExceptionList == None):
            return statusCodeToJSON("400","Missing required parameters")

        getConfigResponse = setConfig(containerList, containerExceptionList)
        if(getConfigResponse):
            return statusCodeToJSON("200","")
        else:
            return statusCodeToJSON("500","Failed to write new configurion")



if __name__ == '__main__':
	app.run(debug=False, host='0.0.0.0', port=80)