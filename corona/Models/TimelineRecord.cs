using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Models
{
    public class TimelineRecord
    {
        public string Date { get; set; }

        public int Cases { get; set; }
        public int Deaths { get; set; }
        public int Recovered { get; set; }
    }
}

