print("\tuploading EventLib.lua")

function addEvent(events, eventId, eventFunction, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		pool = "",
		args = {},
		b = behavior,
		i = index,
		id = eventId
	}
	eventsCopy[eventToAdd.id] = eventToAdd
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

function connectPoolToEvent(eventToConnect, pool)
	print("connectPoolToEvent()")
	local newEvent = eventToConnect
	newEvent.pool = pool
	return newEvent
end

