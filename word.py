from pyspark import SparkContext, SparkConf
sc = SparkContext()

rdd = sc.textFile("hdfs:///choi/line.txt")
words = rdd.flatMap(lambda line : line.split(" "))
print("words.collect() : ",words.collect())

wcPair = words.map(lambda v : (v,1))
print("wcPair.collect() : ", wcPair.collect())

