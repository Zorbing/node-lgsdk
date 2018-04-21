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



	public static getInstance<T extends LogiApi>(klass: typeof LogiApi)
	{
		if (!this._instance)
		{
			this._instance = new (klass as any)();
		}
		return this._instance as T;
	}



	protected _init(type: string)
	{
		if (this.initialized)
		{
			throw new Error(`'The ${type} API is already initialized.`);
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
