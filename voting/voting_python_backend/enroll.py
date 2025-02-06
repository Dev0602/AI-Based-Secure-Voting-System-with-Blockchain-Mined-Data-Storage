# USAGE
# python enroll.py --id 01 --name irfan  //sarath 01  karan 02 kiran 03  04 suryan

# import the necessary packages
from project.utils import Conf
from imutils.video import VideoStream
from tinydb import TinyDB
from tinydb import where
import face_recognition
import argparse
import imutils
# import pyttsx3
import time
import cv2
import os

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--id", required=True, 
	help="Unique student ID of the student")
ap.add_argument("-n", "--name", required=True, 
	help="Name of the student")
ap.add_argument("-c", "--conf", default="config/config.json", 
	help="Path to the input configuration file")
args = vars(ap.parse_args())

# load the configuration file
conf = Conf(args["conf"])

# initialize the database and student table objects
db = TinyDB(conf["db_path"])
studentTable = db.table("student")
# retrieve student details from the database
student = studentTable.search(where(args["id"]))

# check if an entry for the student id does *not* exist, if so, then
# enroll the student
if len(student) == 0: 
	# initialize the video stream and allow the camera sensor to warmup
	print("[INFO] warming up camera...")
	# vs = VideoStream(src=0).start()
	vs = cv2.VideoCapture(0)
	time.sleep(2.0)

	# initialize the number of face detections and the total number
	# of images saved to disk 
	faceCount = 0
	total = 0

	# initialize the text-to-speech engine, set the speech language, and
	# the speech rate
	# ttsEngine = pyttsx3.init()
	# ttsEngine.setProperty("voice", conf["language"])
	# ttsEngine.setProperty("rate", conf["rate"])

	# # ask the student to stand in front of the camera
	# ttsEngine.say("{} please stand in front of the camera until you" \
	# 	"receive further instructions".format(args["name"]))
	# ttsEngine.runAndWait()

	# initialize the status as detecting
	status = "detecting"

	# create the directory to store the student's data
	os.makedirs(os.path.join(conf["dataset_path"], conf["class"], 
		args["id"]), exist_ok=True)

	# loop over the frames from the video stream
	while True:
		# grab the frame from the threaded video stream, resize it (so
		# face detection will run faster), flip it horizontally, and
		# finally clone the frame (just in case we want to write the
		# frame to disk later)
		success,frame = vs.read()
		frame = imutils.resize(frame, width=400)
		frame = cv2.flip(frame, 1)
		orig = frame.copy()
			
		# convert the frame from from RGB (OpenCV ordering) to dlib
		# ordering (RGB) and detect the (x, y)-coordinates of the
		# bounding boxes corresponding to each face in the input image
		rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
		boxes = face_recognition.face_locations(rgb,
			model=conf["detection_method"])
		 
		# loop over the face detections
		for (top, right, bottom, left) in boxes:
			# draw the face detections on the frame
			cv2.rectangle(frame, (left, top), (right, bottom), 
				(0, 255, 0), 2)

			# check if the total number of face detections are less
			# than the threshold, if so, then skip the iteration
			if faceCount < conf["n_face_detection"]:
				# increment the detected face count and set the
				# status as detecting face
				faceCount += 1
				status = "detecting"
				continue

			# save the frame to correct path and increment the total 
			# number of images saved
			p = os.path.join(conf["dataset_path"], conf["class"],
				args["id"], "{}.png".format(str(total).zfill(5)))
			cv2.imwrite(p, orig[top:bottom, left:right])
			total += 1

			# set the status as saving frame 
			status = "saving"

		# draw the status on to the frame
		cv2.putText(frame, "Status: {}".format(status), (10, 20),
			cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

		# show the output frame
		cv2.imshow("Frame", frame)
		cv2.waitKey(1)

		# if the required number of faces are saved then break out from
		# the loop 
		if total == conf["face_count"]:
			# let the student know that face enrolling is over
			# ttsEngine.say("Thank you {} you are now enrolled in the {} " \
			# 	"class.".format(args["name"], conf["class"]))
			# ttsEngine.runAndWait()
			break

	# insert the student details into the database
	studentTable.insert({args["id"]: [args["name"], "enrolled"]})

	# print the total faces saved and do a bit of cleanup
	print("[INFO] {} face images stored".format(total))
	print("[INFO] cleaning up...")
	cv2.destroyAllWindows()
	# vs.stop()

# otherwise, a entry for the student id exists
else:
	# get the name of the student
	name = student[0][args["id"]][0]
	print("[INFO] {} has already already been enrolled...".format(
		name))

# close the database
db.close()
