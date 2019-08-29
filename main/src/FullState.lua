print("\tuploading FullState.lua")

events = {}
pools = {}

functions = {
	toward = to,
	note = note 
}

behaviors = {
	step = function(index, pool)
		return 1 + (index % #pool.drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pool.drops))
	end
}

function changeDropValue(pool, dropIndex, newValue)
	print("changeDropValue()")
	local poolCopy = pool
	poolCopy.drops[dropIndex] = newValue
	return poolCopy
end

function removeDrops(pool, toRemove)
	print("removeDrops()")
	for k, v in pairs(toRemove) do
		for	key, val in pairs(pool.drops) do
			if val == v then
				table.remove(pool.drops, v)
			end
		end
	end
	return pool
end

function addDrops(pool, drops)
	print("addDrops()")
	for k, v in pairs(drops) do
		table.insert(pool, v)
	end
	return pool
end

function addEvent(events, eventId, eventFunction, functionArgs, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		args = functionArgs,
		b = behavior,
		i = index,
		id = eventId
	}
	eventsCopy[eventId] = eventToAdd
	return eventsCopy
end

function removeEvent(eventId)
	print("removeEvent()")
	eventsCopy = events
	eventsCopy[eventId] = nil
	return eventsCopy
end

function setBehavior(eventToChange, newBehavior)
	print("setBehavior()")
	eventCopy = eventToChange
	eventCopy.b = newBehavior
	return eventCopy
end

function connectPoolToArgument(eventId, poolId, argument)
	print("connectPoolToArgument()")
	local newEvent = events[eventId]
	newEvent.args[argument].pool = poolId
	return newEvent
end

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

--THIS DOESN'T WORK, BUT WE DON'T USE IT RIGHT NOW, IT WILL BE 
--DELETED OR FIXED 
function connectArgumentToPool(poolId, eventId, argument)
	print("connectArgumentToPool()")
	local newPool = pools[poolId]
	print("newPool.connected[eventId]: ", newPool.connected.eventId)
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

local nextDrop = function(event, argument)
	print("argument is ", argument)
	local prevIndex = event.args[argument].index
	_c.tell("i", event.id, argument, prevIndex)
	event.args[argument].index = event.b(event.index, event.args[argument].index)
	return pools[event.args[argument].pool].drops[prevIndex] --function for this?
end

function createASL(e)
	print("createASL()")
	local toDo = {}
	for k, v in pairs(e) do
		print("v.func: "..tostring(v.func))
		table.insert(toDo, v.func( 
						function() return nextDrop(v, "destination") end
					,	function() return nextDrop(v, "time") end)
					)
	end
	return toDo
end

function resetScript()
	hasPools = nil 
	print("ready for new lua scripts - restart pools to upload :)")
end

hasPools = function() 
	print("Pools state script status requested")
	_c.tell('pools') 
end

function pretty_print(t)
	print("{ ")
	for k, v in pairs(t) do
		if type(v) == "table" then
			pretty_print(v)
		else
			print(tostring(v)..", ")
		end
	end
	print("}")
end

function init()
	print("init()")
	for c=1, 4 do
        output[c]()
    end
end

function resetPools()
	print("resetting the state")
	_c.tell("reset_state")
	events = {}
	pools = {}
	for n=1,4 do 
		output[n](to(0)) 
	end
	init()
e
