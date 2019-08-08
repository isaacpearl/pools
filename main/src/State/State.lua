events = {}
pools = {}

functions = {toward = to, note = note }

behaviors = {
	step = function(index, pool)
		return 1 + (index % #pool.drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pool.drops))
	end
}

function nextDrop(event)
	local prevIndex = event.i
	event.i = event.b(event.i, event.pool)
	_c.tell("index", event.id, prevIndex)
	return event.pool.drops[prevIndex]
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

function connectPool(event, pool)
	local newEvent = event
	newEvent.pool = pool
	table.insert(pool.connected, newEvent)
	return newEvent
end

function createPool(droplets)
	local pool = {
		drops = droplets, 
		connected = {}
	}
	return pool
end

function createASL(e)
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func(function() return nextDrop(v) end, 0.5))
	end
	return toDo
end

function init()
    for c=1, 4 do
        output[c]()
    end
end

table.insert(pools, createPool({ 1, 2, 3, 8, 10 }))
table.insert(events, createEvent(functions.note, behaviors.step, 1, "abc123"))

connectPool(events[1], pools[1])

output[1].action = loop { createASL(events) }

init()
