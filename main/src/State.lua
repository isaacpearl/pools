events = {}
pools = {}

functions = { toward = to }

behaviors = {
	step = function(index, pool)
		return 1 + (index % #pool.drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pool.drops))
	end;
}

function nextDrop(event)
	local prevIndex = event.i
	event.i = event.b(event.i, event.pool)
	return event.pool.drops[prevIndex]
end

function createEvent(eventFunction, behavior)
	local event = {
		--maybe rename func to be more intuitive
		func = eventFunction,
		pool = nil,
		i = 1,
		b = behavior,
	}
	return event
end

--underscore for k?
function addDrops(pool, drops)
	for k, v in pairs(drops) do
		table.insert(pool, v)
	end
	return pool
end

function removeDrops(pool, toRemove)
	for k, v in pairs(toRemove) do
		for	key, val in pairs(pool.drops) do
			if val == v then
				table.remove(pool.drops, v)
			end
		end
	end
	return pool
end

function createPool(droplets)
	local pool = {
		drops = droplets 
		--connected = {} implement this later
	}
	return pool
end

--for now just one pool -> one event, this would change with more pools
function connectPool(event, pool)
	local newEvent = event
	newEvent.pool = pool
	return newEvent
end

function createASL(e)
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func(function() return nextDrop(v) end, 1))
	end
	return toDo
end

function init()
    for c=1, 4 do
        output[c].asl:action()
    end
end

--the JavaScript UI would send lines such as the following to Crow
--as strings to activate the sequence
table.insert(pools, createPool({ 1, 2, 3, 8, 10 }))
table.insert(events, createEvent(functions.toward, behaviors.step))

connectPool(events[1], pools[1]) --how will we refer to each event/pool?

output[1].action = loop { createASL(events) }

init()

