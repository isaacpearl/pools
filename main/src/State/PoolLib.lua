print("\tuploading PoolLib.lua")

function addPool(pools, uniqueId, droplets)
	print("addPool()")
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
	print("connectEventToPool()")
	local newPool = pool
	table.insert(newPool.connected, eventToConnect)
	return newPool
end

function disconnectEventFromPool(pool, eventToDisconnect)
	print("disconnectEventFromPool()")
	local newPool = pool
	for k, v in pairs(newPool.connected) do
		if v == eventToDisconnect then
			newPool.connected[k] = nil
		end
	end
	return newPool
end
