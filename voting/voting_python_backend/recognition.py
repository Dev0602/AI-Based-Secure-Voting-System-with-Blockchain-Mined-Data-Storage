# USAGE
# python recognition.py 
# import the necessary packages
#from pyimagesearch.utils import Conf
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
# import pyttsx3
import pickle
import time
import cv2
# import onnx
# import onnxruntime as ort
# from onnx_tf.backend import prepare
# import dlib
from imutils import face_utils



# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--conf", default="config/config.json", 
	help="Path to the input configuration file")
args = vars(ap.parse_args())

# load the configuration file
conf = Conf(args["conf"])

# initialize previous and current person to None


prevPerson = None
curPerson = None

# initialize consecutive recognition count to 0
consecCount = 0


# initialize the database, student table, and attendance table
# objects
db = TinyDB(conf["db_path"])
studentTable = db.table("student")
attendanceTable = db.table("attendance")

# load the actual face recognition model along with the label encoder
recognizer = pickle.loads(open(conf["recognizer_path"], "rb").read())
le = pickle.loads(open(conf["le_path"], "rb").read())

# initialize the video stream and allow the camera sensor to warmup
print("[INFO] warming up camera...")
vs = cv2.VideoCapture(0)
#vs = VideoStream(usePiCamera=True).start()
time.sleep(2.0)

# initialize previous and current person to None

prevPerson = None
curPerson = None


while True:
	# store the current time and calculate the time difference
		# between the current time and the time for the class
		currentTime = datetime.now()


		# grab the next frame from the stream, resize it and flip it
		# horizontally
		ret, frame = vs.read()
		h, w, _ = frame.shape
		img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		img = cv2.resize(img, (640, 480))
		img_mean = np.array([127, 127, 127])
		img = (img - img_mean) / 128
		img = np.transpose(img, [2, 0, 1])
		img = np.expand_dims(img, axis=0)
		rgb= img.astype(np.float32)



		# convert the frame from RGB (OpenCV ordering) to dlib 
		# ordering (RGB)
		rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

		# detect the (x, y)-coordinates of the bounding boxes
		# corresponding to each face in the input image
		boxes = face_recognition.face_locations(rgb,
			model=conf["detection_method"])



		# loop over the face detections
		for (top, right, bottom, left) in boxes:
			# draw the face detections on the frame
			cv2.rectangle(frame, (left, top), (right, bottom),(0, 255, 0), 2)
		# calculate the time remaining for attendance to be taken

		# check if atleast one face has been detected	
		if len(boxes) > 0:
			# compute the facial embedding for the face
			encodings = face_recognition.face_encodings(rgb, boxes)
			#results = face_recognition.compare_faces(output/encodings.pickle, encodings, tolerance=0.5)
			#results = face_recognition.compare_faces(recognizer, rgb, tolerance=0.5)		
			# perform classification to recognize the face
			preds = recognizer.predict_proba(encodings)[0]
			#preds = recognizer.predict_proba(encodings)[0]
			j = np.argmax(preds)
			curPerson = le.classes_[j]

			# if the person recognized is the same as in the previous
			# frame then increment the consecutive count
			if prevPerson == curPerson:
				consecCount += 1

			# otherwise, these are two different people so reset the 
			# consecutive count 
			else:
				consecCount = 0

			# set current person to previous person for the next
			# iteration
			prevPerson = curPerson
					
			# if a particular person is recognized for a given
			try:
       

				name = studentTable.search(where(
						curPerson))[0][curPerson][0]
					#ttsEngine.say("{} your attendance has been taken.".format(
					#	name))
					#ttsEngine.runAndWait()
			except:
				continue
      

			# construct a label saying the student has their attendance
			# taken and draw it on to the frame
			label = "{}, you are now marked as present in {}".format(
				name, conf["class"])
			cv2.putText(frame, label, (5, 175),
				cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)




		# show the frame
		cv2.imshow("Attendance System", frame)
		key = cv2.waitKey(1) & 0xFF
		
		# check if the `q` key was pressed
		if key == ord("q"):
				break
		
	
# clean up
print("[INFO] cleaning up...")
print('label', label)

vs.stop()
#db.close()
