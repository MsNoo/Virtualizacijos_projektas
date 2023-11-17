# Server used for managing backups and restores
# 
# To view backups access: http://vhostbackup.localhost/
# To create a backup access: http://vhostbackup.localhost/backup
# To restore a backup access: http://vhostbackup.localhost/restore

# Import all dependencies
from crypt import methods
from flask import Flask, request
from datetime import datetime
import docker
import json
import os
import tarfile

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
        logFile = open("/opt/backup/backupRestoreLog.txt")
        fileOpened = True
    except:
        responseText = "Oops, no backup/restore logs to show! Don’t worry, you can create a backup and see the log details here afterwards."

    if(fileOpened):
        responseText = "Backup/restore logs (showing type, status, status reason, ID number and start and end timestamp of each backup):"
        for line in logFile:
            # Performs transformation from JSON to more user friendly format
            lineElements = json.loads(line)
            responseText += '<br>'
            responseText += lineElements["Type"] + " | " + lineElements["Status"] + " (" + lineElements["StatusReason"] + ") " + lineElements["ID"] + " (" + lineElements["Started"] + " - " + lineElements["Completed"] + ")"
        logFile.close()

    return responseText

# Creates backup/restore log from provided infromation and return completion status      
def createBackupRestoreLog(backupRestoreLogData):
    try:
        backupLog = open('/opt/backup/backupRestoreLog.txt' , 'a')
        backupLog.write(str(backupRestoreLogData) + '\n')
        backupLog.close()
        return True
    except:
        return False

# Creates backup of defined containers
def backupContainers(backupID, timestamp):
    containerList = ["caddy", "vhost1", "vhost2", "vhostbackup"]
    totalSteps = len(containerList)
    completedSteps = 0
    volumepath = "/opt/backup/"

    try:
        client = docker.from_env()
    except:
        return False

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
            return False

    return completedSteps == totalSteps

# Restores a specified container from backup
def restoreContainer(backupid, timestamp, name):
    volumepath = "/opt/backup/"

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
        container = client.containers.run(imageName, detach=True, name=name)
        return True
    except:
        return False

# Performs all restoration process steps (performs restore and logs actions)
def restoreBackup():
    # Set starting variables
    startTimestamp = getDate()
    restoreID = str(getNewID())
    status = "STARTED"
    statusReason = ""
    statusReasonAdditional = ""
    statusNoErrors = True

    # Runs all backup codes
    # Calls ontainer backup code and logs status of it
    restoreBackupID = "20231117131133486028"
    restoreBackupTimestamp = "2023-11-17 13:11:33"
    restoreContainerList = ["vhost1"]

    for name in restoreContainerList:
        containerRestoreDone = restoreContainer(restoreBackupID, restoreBackupTimestamp, name)
        if (containerRestoreDone == False):
            statusReasonAdditional += "FAILED: Container " + name + " restore;"
            statusNoErrors = False

    # check if backups completed and set status
    if(statusNoErrors):
        status = "COMPLETED"
        statusReason = "DONE: 1/1"
    else:
        status = "FAILED"
        statusReason = "DONE: 0/1; " + statusReasonAdditional


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
    
    # Runs all backup codes
    # Calls ontainer backup code and logs status of it
    containerBackupDone = backupContainers(backupID, startTimestamp)


    # check if backups completed and set status
    if(containerBackupDone):
        status = "COMPLETED"
        statusReason = "DONE: 1/1"
    else:
        status = "FAILED"
        statusReason = "DONE: 0/1; FAILED: Container backup"


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
def mainViewFunction():
    if(request.method == 'GET'):
        return getBackupsRestoreLogs()

# This code is executed once http://vhostbackup.localhost/backup is called
@app.route('/backup', methods = ['GET'])
def backupNow():
    if(request.method == 'GET'):
        createBackupResponse = createBackup()

        # Other code option for nice display
        #response = json.loads(createBackupResponse)
        #responseStr = response["ID"] + " " + response["Status"] + " " + response["Started"] + " - " + response["Completed"]

        return createBackupResponse

# This code is executed once http://vhostbackup.localhost/restore is called
@app.route('/restore', methods = ['GET'])
def restoreNow():
    if(request.method == 'GET'):
        retoreBackupResponse = restoreBackup()

        # Other code option for nice display
        #response = json.loads(createBackupResponse)
        #responseStr = response["ID"] + " " + response["Status"] + " " + response["Started"] + " - " + response["Completed"]

        return retoreBackupResponse


# Still I have to figure out what this does :)
if __name__ == '__main__':
	app.run(debug=False, host='0.0.0.0', port=80)