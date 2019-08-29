print("\tuploading EventLib.lua")

function addEvent(events, eventId, eventFunction, functionArgs, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		args = functionArgs,
		b = behavior,
		i = index,
		id = eventId
	}
	eventsCopy[eventToAdd.id] = eventToAdd
	print("destination value: ", eventToAdd.args["destination"]["value"])
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

function connectPoolToArgument(eventToConnect, poolToConnect, argument)
	print("connectPoolToArgument()")
	local newEvent = eventToConnect
	newEvent.args[argument][poolToConnect] = poolToConnect
	return newEvent
end
