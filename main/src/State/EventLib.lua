print("\tuploading EventLib.lua")

function addEvent(events, eventId, eventFunction, functionArgs, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		args = functionArgs,
		b = behavior,
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
