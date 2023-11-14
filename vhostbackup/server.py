# Server used for managing backups
# 
# To view backups access: http://vhostbackup.localhost/
# To create a backup access: http://vhostbackup.localhost/backup

# Import all dependencies
from crypt import methods
from flask import Flask, request
from datetime import datetime
import docker
import json

app = Flask(__name__)

# Return current date and time
def getDate():
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    return current_time

# Return current date and time
def getNewBackupID():
    now = datetime.now()
    newBackupID = now.strftime("%Y%m%d%H%M%S%f")
    return newBackupID

# Checks backup file and returns completed backups
def getBackupsLog():
    fileOpened = False
    responseText = ""

    # Try reading the file - if file can't be opened it means that it's corrupt and according message is showed
    try:
        logFile = open("/opt/backup/backupLog.txt")
        fileOpened = True
    except:
        responseText = "Oops, no backup logs to show! Don’t worry, you can create a backup and see the log details here afterwards."

    if(fileOpened):
        responseText = "Backup logs (showing the status, status reason, ID number and start and end timestamp of each backup):"
        for line in logFile:
            # Performs transformation from JSON to more user friendly format
            lineElements = json.loads(line)
            responseText += '<br>'
            responseText += lineElements["Status"] + " (" + lineElements["StatusReason"] + ") " + lineElements["ID"] + " (" + lineElements["Started"] + " - " + lineElements["Completed"] + ")"
        logFile.close()

    return responseText

# Creates backup log from provided infromation and return completion status      
def createBackupLog(backupLogData):
    try:
        backupLog = open('/opt/backup/backupLog.txt' , 'a')
        backupLog.write(str(backupLogData) + '\n')
        backupLog.close()
        return True
    except:
        return False

def backupContainers(backupID, timestamp):
    # backup tracking variables
    step0 = True
    step1 = False
    step2 = False
    step3 = False

    # Get docker env - step 0
    try:
        client = docker.from_env()
    except:
        step0 = False

    # backups vhost1 container - step 1
    try:
        containerVHOST1 = client.containers.get("vhost1")
        imageVHOST1 = containerVHOST1.commit(repository="dockerbackup", tag=str(timestamp).replace(" ","").replace("-","").replace(":",""), message=str(backupID))
        imageVHOST1.save(str(backupID)+"_VHOST1.tar")
        step1 = True
    except:
        step1 = False

    # backups vhost2 container - step 2
    try:
        containerVHOST1 = client.containers.get("vhost2")
        imageVHOST1 = containerVHOST1.commit(repository="dockerbackup", tag=str(timestamp).replace(" ","").replace("-","").replace(":",""), message=str(backupID))
        imageVHOST1.save(str(backupID)+"_VHOST2.tar")
        step2 = True
    except:
        step2 = False

    # backups vhost1 container - step 3
    try:
        containerVHOST1 = client.containers.get("vhostbackup")
        imageVHOST1 = containerVHOST1.commit(repository="dockerbackup", tag=str(timestamp).replace(" ","").replace("-","").replace(":",""), message=str(backupID))
        imageVHOST1.save(str(backupID)+"_VHOSTBACKUP.tar")
        step3 = True
    except:
        step3 = False

    #Will need this code in future
    #To restore a docker container from a backup, you need to use the load_image method, which loads an image from a tar file or a stream. You can specify a repository and a tag for the loaded image, as well as a quiet mode. For example, if you want to load an image from a tar file named “my-backup.tar”, you can do:
    #image = client.images.load_image("my-backup.tar", repository="my-backup", tag="latest", quiet=False)
    #The load_image method returns an image object, which you can use to inspect or manipulate the image. For example, you can print the image ID or run a container from the image:
    #container = client.containers.run(image, name="my-restored-container", detach=True)
    #The run method returns a container object, which you can use to inspect or manipulate the container. For example, you can print the container ID or start the container:
    #container.start()

    if (step0 and step1 and step2 and step3):
        return True
    else:
        return False


# Performs all backup process steps (creates backup, logs actions)
def createBackup():
    # Set starting variables
    startTimestamp = getDate()
    backupID = str(getNewBackupID())
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
        "Status": str(status),
        "StatusReason": str(statusReason),
        "Started": str(startTimestamp),
        "Completed": str(getDate())
    }
    backupResponse = json.dumps(backupResponseBuild)
    
    # Logs backup
    if (createBackupLog(backupResponse)):
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
        return getBackupsLog()

# This code is executed once http://vhostbackup.localhost/backup is called
@app.route('/backup', methods = ['GET'])
def backupNow():
    if(request.method == 'GET'):
        createBackupResponse = createBackup()

        # Other code option for nice display
        #response = json.loads(createBackupResponse)
        #responseStr = response["ID"] + " " + response["Status"] + " " + response["Started"] + " - " + response["Completed"]

        return createBackupResponse
        
# Still I have to figure out what this does :)
if __name__ == '__main__':
	app.run(debug=False, host='0.0.0.0', port=80)