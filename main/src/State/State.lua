print("\tuploading State.lua")

local nextDrop = function(event, argument)
	local a = event.args[argument]
	local prevIndex = a.index
	local nextIndex = a.behavior(prevIndex, a.pool)
	_c.tell("i", event.id, argument, nextIndex, prevIndex)
	a.prevIndex = prevIndex
	a.index = nextIndex 	
	return pools[a.pool].drops[nextIndex] --function for this?
end

function createASL(e)
	print("createASL()")
	local toDo = {}
	for k, v in pairs(e) do
		table.insert(toDo, v.func( 
						function() return nextDrop(v, "destination") end
					,	function() return nextDrop(v, "time") end)
					)
	end
	return toDo
end
