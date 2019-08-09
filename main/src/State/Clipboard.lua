print("globals:")
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


table.insert(pools, createPool({ 2, 3, 8, 10 }))
pools = addPool(pools, 123, { 8, 10 })

--took out all function calls except init()
pools = addPool(pools, "12345", { 8, 10 })
table.insert(events, createEvent(functions.note, behaviors.step, 1, "abc123"))
print("pools id:", pools["12345"].id)
connectPoolToEvent(events[1], pools["12345"])
connectEventToPool(pools["12345"], events[1])

output[1].action = loop { createASL(events) }


