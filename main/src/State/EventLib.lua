print("\tuploading EventLib.lua")

function addEvent(events, eventId, eventFunction, functionArgs, behavior, index)
	print("addEvent()")
	eventsCopy = events
	eventToAdd = {
		func = eventFunction,
		args = functionArgs,
		id = eventId
	}
	for k, v in pairs(eventToAdd.args) do
		eventToAdd = setBehavior(eventToAdd, eventToAdd.args[k].behavior, k)
		eventToAdd = connectPoolToArgument(eventToAdd, eventToAdd.args[k].pool, k)
	end
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
	local eventCopy = eventToChange
	eventCopy.args[argument].behavior = behaviors[newBehavior]
	return eventCopy
end

function connectPoolToArgument(eventToChange, poolId, argument)
	print("connectPoolToArgument()")
	local eventCopy = eventToChange
	eventCopy.args[argument].pool = poolId
	return eventCopy
end
