print("\trunning EventLib.lua")

function addEvent(events, eventId, eventFunction, behavior, index)
	print("calling addEvent()")
	local eventsCopy = events
	local event = {
		func = eventFunction,
		pool = nil,
		b = behavior,
		i = index,
		id = eventId
	}
	eventsCopy[eventId] = event
	return eventsCopy
end

function connectPoolToEvent(event, pool)
	print("calling connectPoolToEvent()")
	local newEvent = event
	newEvent.pool = pool
	return newEvent
end
