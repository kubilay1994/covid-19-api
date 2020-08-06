﻿using corona.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Entities
{
    [BsonCollection("coronaRecords")]
    public class CoronaRecord
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; }
        public string Country { get; set; }

        public IEnumerable<TimelineRecord> Timeline { get; set; }

    }
}

