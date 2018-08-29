

from pyspark import SparkContext
import argparse

#spark context
sc = SparkContext()

#make & receved outer argument
parser = argparse.ArgumentParser()

parser.add_argument("--file", help=": file name")
parser.add_argument("--word", help=": search word name")

filename = parser.parse_args().file
search = parser.parse_args().word

#read file route
text_file = sc.textFile("hdfs:///data/"+ filename)

#word search and count
counts = text_file.flatMap(lambda line: line.split(" "))\
	     .filter(lambda i : i == search)\
             .map(lambda word: (word, 1)) \
             .reduceByKey(lambda a, b: a + b)

#print wordcount
print counts.collect()



