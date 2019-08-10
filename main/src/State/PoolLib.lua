print("\trunning PoolLib.lua")
function addPool(pools, uniqueId, droplets)
	local poolsCopy = pools 
	local pool = {
		id = uniqueId,
		drops = droplets, 
		connected = {}
	}
	poolsCopy[pool.id] = pool
	return poolsCopy
end
function connectEventToPool(pool, eventToConnect)
	local newPool = pool
	table.insert(newPool.connected, eventToConnect)
	return newPool
end
