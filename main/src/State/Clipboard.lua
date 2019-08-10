--this is a file for Isaac to hold onto parts of the lua state system
--while debugging memory/syntax issues
function deepcopy(orig)
    local orig_type = type(orig)
    local copy
    if orig_type == 'table' then
        copy = {}
        for orig_key, orig_value in next, orig, nil do
            copy[deepcopy(orig_key)] = deepcopy(orig_value)
        end
        setmetatable(copy, deepcopy(getmetatable(orig)))
    else -- number, string, boolean, etc
        copy = orig
    end
    return copy
	end
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

function createPool(droplets)
	local pool = {
		drops = droplets, 
		connected = {}
	}
	return pool
end
function createEvent(eventFunction, behavior, index, uniqueId)
	local event = {
		func = eventFunction,
		pool = nil,
		b = behavior,
		i = index,
		id = uniqueId
	}
	return event
end
pools = addPool(pools, "12345", { 5, 8, 10 })
events = addEvent(events, "abc123", functions.note, behaviors.step, 1)
connectPoolToEvent(events["abc123"], pools["12345"])
connectEventToPool(pools["12345"], events["abc123"])
changeDropValue(pools["12345"], 2, 9)
changeDropValue(pools['12345'], 3, 12)
output[1].action = loop { createASL(events) }

init()
