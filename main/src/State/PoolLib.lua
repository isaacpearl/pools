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

-- (default) argument = {color =  "", index =  1, pool =  "", value =  1 }
function connectArgumentToPool(pool, eventId, argument)
	print("connectArgumentToPool()")
	local newPool = pool
	if newPool.connected[eventId] == nil then
		newPool.connected[eventId] = {argument.name = argument}
	else
		newPool.connected[eventId][argument.name] = argument
	end
	return newPool
end

function disconnectArgumentFromPool(pool, eventToDisconnect, argToDisconnect)
	print("disconnectArgumentFromPool()")
	local newPool = pool
	if newPool.connected[eventToDisconnect][argToDisconnect] == nil then
		return
	else
		newPool.connected[eventToDisconnect][argToDisconnect] = nil 
		return newPool
	end
end

function disconnectEventFromPool(pool, eventToDisconnect)
	print("disconnectEventFromPool()")
	local newPool = pool
	newPool.connected[eventToDisconnect] = nil
	return newPool
end
