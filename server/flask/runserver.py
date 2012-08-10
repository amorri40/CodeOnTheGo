#!/bin/python

from flask import Flask,render_template,url_for,redirect,request
import subprocess,os,datetime, shutil, aes
app = Flask(__name__)
app.debug = True
password = "userpassword"


@app.route('/files/<filename>',methods=['GET', 'POST'])
def printfiles(filename):
    returnstring=""
    fname=request.args.get('fname', '').replace('..','').replace('////','//')
    if (request.args.get('save', '') == 'true') :
       
       passcode=request.form['pass']
       encrypted=request.form['code']
       blocksize = 256
       
       if (aes.decrypt( passcode, password, blocksize )) != "secret": return "Failed"
       #decrypt the code now that we know its the valid password
       decrypted = aes.decrypt( encrypted, password, blocksize )
       
       now = datetime.datetime.now()
       print 'save fname:'+fname
       #first backup the original file
       backupname= './projects/backup/'+now.strftime("%Y-%m-%d")+'_'+str(now.hour)+'/'+fname
       if not os.path.exists(os.path.dirname(backupname)): os.makedirs(os.path.dirname(backupname))
       shutil.copyfile('./projects/'+fname, backupname)
       
       f = open('./projects/'+fname, 'w')
       f.write(decrypted)
       f.close()
       return "saved at: "+str(datetime.datetime.now())
    if fname == '':
     fname='.'
    if (not os.path.isdir('./projects/'+fname)):
      extension = os.path.splitext(fname)[1]
      with open('./projects/'+fname, 'r') as content_file:
         content = content_file.read()
      return render_template('syntaxEditor.html',extension=extension,content=content,fname=fname) #'<html><body><textarea>'+ content.replace('<','&lt;').replace('>','&gt;')+'</textarea></body></html>'
    for dirname, dirnames, filenames in os.walk('./projects/'+fname):
     for subdirname in dirnames:
        returnstring+="<br><a href='/files/fname?fname="+ os.path.join(fname, subdirname)+"'>"+subdirname+"</a>"
     for filename in filenames:
        returnstring+="<br><a href='/files/fname?fname="+ os.path.join(fname, filename)+"'>"+filename+"</a>"

     return '<html><body>'+returnstring+'</body></html>'

if __name__ == '__main__':
     app.run(host='0.0.0.0')
