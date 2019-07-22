events = {}
pools = {}
functions = { toward = asllib.to }
behaviors = {
	step = function(index, pool)
		return 1 + (index % #pool.drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pool.drops))
	end;
}

function next(event)
	prevIndex = event.i
	event.i = event.b(event.i, event.pool)
	return event.pool.drops[prevIndex]
end

function createEvent(eventFunction, behavior)
	event = {
		--maybe rename func to be more intuitive
		func = eventFunction,
		pool = nil,
		i = 1,
		b = behavior,
	}
	return event
end

function addDrops(pool, drops)
	for index, value in pairs(drops) do
		table.insert(pool, value)
	end
	return pool
end

function removeDrops(pool, drops)
	for index, value in pairs(drops) do
		for	drop=1, #pool do
			if pool[drop] == value then
				table.remove(pool, value)
			end
		end
	return pool
	end
end

function createPool(droplets)
	pool = {
		drops = droplets 
		--connected = {} implement this later
	}
	return pool
end
--for now just one pool -> one event, this would change with more pools
function connectPool(event, pool)
	newEvent = event
	newEvent.pool = pool
	return newEvent
end

function doEvents()
	toDo = {}
	for index, value in pairs(events) do
		newIndex = value.b(value.i, value.pool)
		--refactor so this line makes any sense at all, please
		table.insert( toDo, value.func(value.pool.drops[value.i], 1) )
		value.i = newIndex 
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
table.insert(pools, createPool({ 1, 2, 3, }))
table.insert(events, createEvent(functions.toward, behaviors.step))
connectPool(events[1], pools[1]) --how will we refer to each event/pool?
output[1].action = loop { doEvents() }

init()
