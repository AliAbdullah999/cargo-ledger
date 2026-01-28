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

export function commafy(num: number | string): string {
  return num
    .toString()
    .replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}