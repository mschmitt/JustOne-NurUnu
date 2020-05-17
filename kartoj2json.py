#!/usr/bin/python3

import ezodf
import json

data = []

spreadsheet = ezodf.opendoc('Kartoj_Listo.ods')
sheet = spreadsheet.sheets[0]
for row in sheet.rows():
	data_row = []
	for cell in row:
		data_row.append(cell.value)
	data.append(data_row);

print(json.dumps(data))
