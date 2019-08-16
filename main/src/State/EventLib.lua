print("\trunning EventLib.lua")

function addEvent(events, eventId, eventFunction, behavior, index)
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		pool = "",
		b = behavior,
		i = index,
		id = eventId
	}
	eventsCopy[eventToAdd.id] = eventToAdd
	return eventsCopy
end

function removeEvent(eventId)
	eventsCopy = events
	eventsCopy[eventId] = nil
	return eventsCopy
end

function setBehavior(eventToChange, newBehavior)
	eventCopy = eventToChange
	eventCopy.b = newBehavior
	return eventCopy
end

function connectPoolToEvent(eventToConnect, pool)
	local newEvent = eventToConnect
	newEvent.pool = pool
	return newEvent
end

