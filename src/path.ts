const pckg = require('../package.json');


let pathMap = {
	 'ia32': 'x86'
	, 'x64': 'x64'
};
if (!pathMap.hasOwnProperty(process.arch))
{
	throw new Error(`Architecture ${process.arch} not supported.`)
}

export function libPath(type: string, version?: string)
{
	if (version === undefined)
	{
		version = pckg.config[type];
	}
	type = type[0].toUpperCase() + type.slice(1).toLowerCase();
	let arch = pathMap[process.arch];
	return `./lib/${arch}/Logitech${type}EnginesWrapper-${version}`;
}
