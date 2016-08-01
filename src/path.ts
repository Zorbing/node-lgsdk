let pathMap = {
	 'ia32': 'x86'
	, 'x64': 'x64'
};
if (!pathMap.hasOwnProperty(process.arch))
{
	throw new Error(`Architecture ${process.arch} not supported.`)
}
function libPath(type: string)
{
	type = type[0].toUpperCase() + type.slice(1).toLowerCase();
	let arch = pathMap[process.arch];
	return `./lib/${arch}/Logitech${type}EnginesWrapper`;
}
export default libPath;
