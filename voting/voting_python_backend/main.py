from flask import Flask, app,request
from imutils.video import VideoStream
from datetime import datetime
from datetime import date
import numpy as np
import dlib
import argparse
from base64 import b64decode
import imutils
import time
import cv2
import pickle
from imutils import face_utils
# import tensorflow as tf
import urllib.request
import urllib.parse
import string
import random
import time
# from datauri import DataURI
from flask import jsonify
from flask_cors import CORS, cross_origin
import glob
import json
from project.utils import Conf
from imutils.video import VideoStream
from datetime import datetime
from datetime import date
from tinydb import TinyDB
from tinydb import where
import face_recognition
import numpy as np
import argparse
import imutils
import pickle
import time
import cv2
from imutils import face_utils

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--conf", default="config/config.json", 
	help="Path to the input configuration file")
args = vars(ap.parse_args())

# load the configuration file
conf = Conf(args["conf"])
prevPerson = None
curPerson = None
consecCount = 0
db = TinyDB(conf["db_path"])
studentTable = db.table("student")
attendanceTable = db.table("attendance")
recognizer = pickle.loads(open(conf["recognizer_path"], "rb").read())
le = pickle.loads(open(conf["le_path"], "rb").read())

# print("[INFO] warming up camera...")
# vs = VideoStream(src=0).start()
# time.sleep(2.0)


global result_flag

unknown_flag = 0

process_flag = 0
# initialize previous and current person to None
prevPerson = None
curPerson = None

# initialize consecutive recognition count to 0
consecCount = 0
imagecount=0





app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
face_flag = 0
@app.route('/voting', methods=['GET','POST'])
@cross_origin()
def login():
  if request.method == 'POST':
    imagecount=0
    result = process(request.json['uri'])
    return result
  

def process(uri):
  
  global row_count,names_flag,imagecount
  data_uri = uri
  header,encoded = data_uri.split(",",1)
  data = b64decode(encoded)
  f = open("image.png", "wb")
  f.write(data)
  row_count=0
  names_flag=0
  namess=[]
  encoding=[]
  frame = cv2.imread("image.png")
  h, w, _ = frame.shape
  img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
  img = cv2.resize(img, (640, 480))
  img_mean = np.array([127, 127, 127])
  img = (img - img_mean) / 128
  img = np.transpose(img, [2, 0, 1])
  img = np.expand_dims(img, axis=0)
  rgb= img.astype(np.float32)
  rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
  boxes = face_recognition.face_locations(rgb,
    model=conf["detection_method"])

  for (top, right, bottom, left) in boxes:
    # draw the face detections on the frame
    cv2.rectangle(frame, (left, top), (right, bottom),(0, 255, 0), 2)
  # calculate the time remaining for attendance to be taken

  # check if atleast one face has been detected	
  if len(boxes) > 0:
    encodings = face_recognition.face_encodings(rgb, boxes)
    preds = recognizer.predict_proba(encodings)[0]
    j = np.argmax(preds)
    curPerson = le.classes_[j]
    name = studentTable.search(where(
        curPerson))[0][curPerson][0]
    return {"success":"true","id":curPerson}
  else:
    return {"success":"false"}



if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
    
