print("\tuploading EventLib.lua")

function addEvent(events, eventId, eventFunction, functionArgs, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		args = functionArgs,
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

function setBehavior(eventToChange, newBehavior, argument)
	print("setBehavior()")
	eventCopy = eventToChange
	print(eventCopy.args[argument])
	eventCopy.args[argument].behavior = newBehavior
	return eventCopy
end

function connectPoolToArgument(eventId, poolId, argument)
	print("connectPoolToArgument()")
	local newEvent = events[eventId]
	newEvent.args[argument].pool = poolId
	return newEvent
end
