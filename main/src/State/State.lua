print("\trunning State.lua")
local nextDrop = function(event)
	local prevIndex = event.i
	_c.tell("i", event.id, prevIndex)
	event.i = event.b(event.i, event.pool)
	return event.pool.drops[prevIndex]
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
init()
