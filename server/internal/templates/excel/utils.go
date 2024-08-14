package excel

func ToAlphaString(index int) string {
	result := ""
	for index >= 0 {
		result = string('A'+(index%26)) + result
		index = index/26 - 1
	}
	return result
}
