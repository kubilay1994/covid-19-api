using corona.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Entities
{
    public class CoronaWorldRecord
    {

        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; }

        public TimelineRecord Timeline { get; set; }
    }
}
