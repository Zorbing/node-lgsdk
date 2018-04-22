export abstract class LogiApi
{
	protected static _instance: LogiApi | null = null;



	protected _initialized = false;



	public get initialized()
	{
		return this._initialized;
	}



	protected constructor()
	{
	}



	public static getInstance(klass: any/* extends LogiApi*/): any
	{
		if (!this._instance)
		{
			this._instance = new klass();
		}
		return this._instance;
	}



	protected _init(type: string)
	{
		if (this.initialized)
		{
			throw new Error(`'The ${type}-API had already been initialized.`);
		}
	}

	protected _shutdown()
	{
		if (this.initialized)
		{
			this._initialized = false;
			return true;
		}
		else
		{
			return false;
		}
	}
}
