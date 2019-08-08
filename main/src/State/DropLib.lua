local changeDropValue = function(pool, dropIndex)
	return 0
end

--why does these need to be a local variable to work? sometimes it triggers !chunk too long
local removeDrops = function(pool, toRemove)
	for k, v in pairs(toRemove) do
		for	key, val in pairs(pool.drops) do
			if val == v then
				table.remove(pool.drops, v)
			end
		end
	end
	return pool
end

local addDrops = function (pool, drops)
	for k, v in pairs(drops) do
		table.insert(pool, v)
	end
	return pool
end

