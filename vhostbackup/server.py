
from crypt import methods
from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

def getDate():
    now = datetime.now()
    current_time = now.strftime("%Y-%m-%d %H:%M:%S")
    return current_time

@app.route('/', methods = ['GET'])
def home():
    if(request.method == 'GET'):
        messageWeb = 'Atsarginės kopijos kurtos:'
        with open('/opt/backup/backupLog.txt') as f:
            for line in f:
                messageWeb += '<br>'
                messageWeb += line
        f.close()
        return messageWeb

@app.route('/backup', methods = ['GET'])
def backUP():
    if(request.method == 'GET'):
        timestamp = str(getDate())
        file2 = open('/opt/backup/backupLog.txt' , 'a')
        file2.write(timestamp + '\n')
        file2.close()

        messageWeb = 'Atsarginė kopija sukurta: ' + timestamp
        return messageWeb
        

if __name__ == '__main__':

	app.run(debug=True, host='0.0.0.0', port=80)


