from pyspark import SparkContext
import argparse

#spark context
sc = SparkContext()

#make & receved outer argument
parser = argparse.ArgumentParser()

parser.add_argument("--file", help=": file name")
parser.add_argument("--user", help=": user name")

filename = parser.parse_args().file
username = parser.parse_args().user

#read file route
text_file = sc.textFile("hdfs:///"+username+"/"+ filename)

#wordcount
counts = text_file.flatMap(lambda line: line.split(" ")) \
             .map(lambda word: (word, 1)) \
             .reduceByKey(lambda a, b: a + b)

#print wordcount
print counts.collect()
