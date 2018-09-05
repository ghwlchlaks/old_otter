from pyspark import SparkContext, SparkConf
import argparse

parser = argparse.ArgumentParser()
sc = SparkContext()

print(sc.applicationId)
parser.add_argument("--file", help="type options values..zz")
args = parser.parse_args()


text_file =  sc.textFile("hdfs:///data/"+args)
counts = text_file.flatMap(lambda line: line.split(" ")) \
              .map(lambda word: (word, 1)) \
             .reduceByKey(lambda a, b: a + b)
#print("word count : ", counts.collect())
output = counts.collect()
if args.type:
    if "odd"==args.type:
        print("odd")
        for (word, count) in output:
            if(count %2 == 1):
                print("%s : %i" % (word, count))
    elif "even"==args.type:
        print("even")
        for (word, count) in output:
            if(count %2 == 0):
                print("%s : %i" % (word, count))
    else:
        print("??")
