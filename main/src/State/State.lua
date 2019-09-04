print("\tuploading State.lua")

local nextDrop = function(event, argument)
	local a = event.args[argument]
	local prevIndex = a.index
	local nextIndex = a.behavior(prevIndex, a.pool)
	_c.tell("i", event.id, argument, nextIndex, prevIndex)
	a.prevIndex = prevIndex
	a.index = nextIndex
	return translate(pools[a.pool].drops[nextIndex], a.type)
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

function translate(value, type)
	print("type: ", type)
	return value	
end

function nearestValue(table, number)
    local smallestSoFar = -1
    for k, v in pairs(table) do
        if (math.abs(number-v) < smallestSoFar) then
            smallestSoFar = math.abs(number-v)
        end
    end
    return smallestSoFar
end
