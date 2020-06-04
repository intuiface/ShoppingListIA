using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static InterfaceAssetTemplate.IATemplate;

namespace InterfaceAssetTemplate.Events
{
    public class EnumEventArgs : EventArgs
    {
        public SimpleEnum Enum1{ get; set; }
        public AssignedEnum Enum2 { get; set; }
    }
}
