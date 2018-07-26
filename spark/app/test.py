import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--fname", help="type options values..zz")
fname = parser.parse_args().fname

if fname == 'None':
	print(fname)
else:
	print("fail")

