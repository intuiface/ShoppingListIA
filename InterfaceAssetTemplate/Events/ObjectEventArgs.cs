using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterfaceAssetTemplate.Events
{
    public class ObjectEventArgs : EventArgs
    {
        public string String1 { get; set; }
        public string String2 { get; set; }
    }
}
