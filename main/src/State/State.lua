function nextDrop(event)
	local prevIndex = event.i
	event.i = event.b(event.i, event.pool)
	--_c.tell("i", event.id, prevIndex)
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
pools = addPool(pools, "12345", { 5, 8, 10 })
table.insert(events, createEvent(functions.note, behaviors.step, 1, "abc123"))
connectPoolToEvent(events[1], pools["12345"])
connectEventToPool(pools["12345"], events[1])
local test = changeDropValue(pools["12345"], 2, 11)
print(test.drops[2])
output[1].action = loop { createASL(events) }
init()
