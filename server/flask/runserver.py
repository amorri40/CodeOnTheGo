#!/bin/python

from flask import Flask,render_template,url_for,redirect,request
import subprocess,os
app = Flask(__name__)
app.debug = True


@app.route('/files/<filename>')
def printfiles(filename):
    os.system("ls -l")
    returnstring=""
    fname=request.args.get('fname', '').replace('..','')
    if fname == '':
     fname='.'
    if (not os.path.isdir('./projects/'+fname)):
      with open('./projects/'+fname, 'r') as content_file:
         content = content_file.read()
      return '<html><body><textarea>'+ content.replace('<','&lt;').replace('>','&gt;')+'</textarea></body></html>'
    for dirname, dirnames, filenames in os.walk('./projects/'+fname):
     for subdirname in dirnames:
        returnstring+="<br><a href='/files/fname?fname="+ os.path.join(dirname, subdirname)+"'>"+subdirname+"</a>"
     for filename in filenames:
        returnstring+="<br><a href='/files/fname?fname="+ os.path.join(dirname, filename)+"'>"+filename+"</a>"

     return '<html><body>'+returnstring+'</body></html>'

if __name__ == '__main__':
     app.run(host='0.0.0.0')
