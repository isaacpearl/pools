print("\tuploading State.lua")

local nextDrop = function(event, argument)
	print("argument is ", argument)
	local prevIndex = event.args[argument].index
	_c.tell("i", event.id, argument, prevIndex)
	event.args[argument].index = event.b(event.index, event.args[argument].index)
	return pools[event.args[argument].pool].drops[prevIndex] --function for this?
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
