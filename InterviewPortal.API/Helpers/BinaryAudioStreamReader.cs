using System.IO;
using Microsoft.CognitiveServices.Speech.Audio;

namespace InterviewPortal.API.Helpers
{
    public class BinaryAudioStreamReader : PullAudioInputStreamCallback
    {
        private readonly Stream _stream;

        public BinaryAudioStreamReader(Stream stream)
        {
            _stream = stream;
        }

        public override int Read(byte[] dataBuffer, uint size)
        {
            return _stream.Read(dataBuffer, 0, (int)size);
        }

        public override void Close()
        {
            _stream.Dispose();
            base.Close();
        }
    }
}
