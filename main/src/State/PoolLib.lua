print("\tuploading PoolLib.lua")

function addPool(pools, uniqueId, droplets)
	print("addPool()")
	local poolsCopy = pools 
	local pool = { id = uniqueId, drops = droplets,connected = {} }
	poolsCopy[pool.id] = pool
	return poolsCopy
end

function connectEventToPool(pool, eventToConnect)
	print("connectEventToPool()")
	local newPool = pool
	table.insert(newPool.connected, eventToConnect)
	return newPool
end

function connectArgumentToPool(pool, eventId, argument)
	print("connectArgumentToPool()")
	local newPool = pool
	if newPool.connected[eventId] == nil then
		local eventArgsObject = {}
		eventArgsObject[argument.name] = argument
		newPool.connected[eventId] = eventArgsObject 
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
	return
end

function disconnectEventFromPool(pool, eventToDisconnect)
	print("disconnectEventFromPool()")
	local newPool = pool
	newPool.connected[eventToDisconnect] = nil
	return newPool
end
