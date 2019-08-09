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
function connectEventToPool(pool, event)
	local newPool = pool
	table.insert(newPool.connected, event)
	return newPool
end
