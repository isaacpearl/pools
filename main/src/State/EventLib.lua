function connectPoolToEvent(event, pool)
	local newEvent = event
	newEvent.pool = pool
	return newEvent
end
