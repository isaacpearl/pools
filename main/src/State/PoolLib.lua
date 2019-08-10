print("\trunning PoolLib.lua")
function addPool(pools, uniqueId, droplets)
	print("calling addPool()")
	local poolsCopy = pools 
	local pool = {
		id = uniqueId,
		drops = droplets, 
		connected = {}
	}
	poolsCopy[pool.id] = pool
	return poolsCopy
end
function connectEventToPool(pool, event)
	print("calling connectEventToPool()")
	local newPool = pool
	table.insert(newPool.connected, event)
	return newPool
end
