export const processNum = (num: number | string) => {
	let str = num.toString().replaceAll(',', '');
	let res = Number(str);
	return res;
}

export const addValueToArr = (arr: Array<any>, newVal: any) => {
	let tmpArr = arr;
	tmpArr.push(newVal);
	return tmpArr;
}

export const removeValueFromArr = (arr: Array<any>, value: any) => {
	var index = arr.indexOf(value);
	let tmpArr = arr;
	if (index > -1) {
		tmpArr.splice(index, 1);
	}
	return tmpArr;
}

export const commafy = (value: number | string) => {
  const num = Number(value);
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-US"); // Handles all scales (e.g., 1,000 → 1,000)
};
