import {useState} from 'react';

import OpenAI from 'openai';
import './App.css';

import {paperCutDemo} from './paperCutDemo';
import spinner from './spinner.gif';
import {missingFlightDemo} from './missingFlightDemo';
import {publicSpeakingDemo} from './publicSpeakingDemo';

const model = 'gpt-4o-mini';
const imageModel = 'gpt-image-1-mini';

const createOpenAIClient = (apiKey: string) =>
  new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

const completePrompt = async (
  openai: OpenAI,
  prompt: string,
  maxTokens: number,
  temperature?: number,
) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [{role: 'user', content: prompt}],
    max_tokens: maxTokens,
    ...(temperature !== undefined && {temperature}),
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
};

const initialBotCommentary =
  "What are you worried about today? Let me tell you if it's a problem. There's no harm in checking!";

const randomProblemPlaceholder = () => {
  const worries = [
    'Coffee too hot',
    'Locking keys in car',
    'Forgetting where I parked',
    'Phone dying',
    'Mismatched socks',
    'Left stove on',
    'Texting wrong person',
  ];

  return worries[Math.floor(Math.random() * worries.length)];
};

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [botCommentary, setBotCommentary] = useState(initialBotCommentary);

  const [apiKey, setApiKey] = useState('');
  const [problemPlaceholder] = useState(randomProblemPlaceholder());

  const [worry, setWorry] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  const resetGeneratedData = () => {
    setTitle('');
    setImage('');
    setConfirmation('');
  };

  const clearState = () => {
    setBotCommentary(initialBotCommentary);
    setIsLoading(false);
    setWorry('');
    setConfirmation('');
    setTitle('');
    setImage('');
  };

  const loadDemo = (demo: typeof paperCutDemo) => {
    const {botCommentary, isLoading, worry, confirmation, title, image} = demo;

    setBotCommentary(botCommentary);
    setIsLoading(isLoading);
    setWorry(worry);
    setConfirmation(confirmation);
    setTitle(title);
    setImage(image);
  };

  const fetchBotCommentary = (openai: OpenAI) =>
    completePrompt(
      openai,
      `Generate a short message to say "${worry}" could be a problem and that you need some minutes to think about it. Mention one aspect of the sentence. When you mention the issue, don't put it in quotes.`,
      60,
    );

  const fetchConfirmation = (openai: OpenAI) =>
    completePrompt(
      openai,
      `Create a short article abouth how "${worry}" could be a potential problem or even dangerous. Make it sound scary. It should be realistic but can also exaggerate the risk. Make sure you reassure me that my fear is a reasonable one and that I'm not overreacting. Don't include a title.
      ###
      Worry: Trampolines
      Article: 
      Jumping on a trampoline may seem like a fun physical activity for your child, but how safe is this popular pastime? The truth is that trampolines pose a significant safety concern for all children, especially those under the age of six.

      I'm telling you this as a doctor, but also as a parent. My four-year-old son has recently been invited to two birthday parties at trampoline parks. Unfortunately, I will not be allowing him to attend due to concerns for his safety. I expected some tears or a tantrum when I told him, but after hearing me explain the safety concerns, he just said, “OK.”

      Trampolines pose several safety risks to children and are frequently the cause of accidents and injuries. These injuries from trampolines can be as mild as a sprain or bruise, or as severe as broken bones, dislocated joints, head injuries and even paralysis.

      But don’t just take it from me. The American Academy of Pediatrics discourages parents from allowing any child to use a recreational trampoline because of its hidden dangers.

      In the United States in 2014, there were nearly 286,000 reported injuries caused by trampolines. These injuries most often occur when children are jumping on trampolines, but can also occur if children fall off the trampoline or collide with other jumpers.

      With the increasing popularity of trampoline parks across the country, the rate of injuries has continued to rise — the American Academy of Pediatrics noted a “soaring number of emergency room visits for injuries sustained at these recreational venues.” ER visits from trampoline park injuries increased from an estimated 581 visits in 2010 to 6,932 visits in 2014. Trampoline parks are more likely to cause injury than home trampolines because of the increased strength of the mats, causing greater force or pressure on the body. The most common injuries from trampolines of either kind are sprains and fractures.

      Although trampolines pose a safety risk for anyone, young children (like my son) are at higher risk for injury because they have weaker bones and joints, and less control of their bodies while jumping. For this reason, the American Academy of Orthopaedic Surgeons recommends children under six years old not use trampolines, stating that they can be “extremely dangerous.”
      ###
      Worry: Alcohol
      Article:
      If you have a little too much alcohol once in a while, it probably won’t do lasting damage if you’re otherwise healthy. But it’s a different story if you regularly drink heavily.

      For most men, that’s defined as more than 4 drinks a day, or 14 or 15 in a week. For women, heavy drinking is more than 3 drinks in a day, or 7 or 8 per week.

      Too much alcohol can harm you physically and mentally in lots of ways.

      Liver Damage
      Alcohol is a toxin, and it’s your liver’s job to flush it out of your body. But your liver may not be able to keep up if you drink too much too fast. Alcohol can kill liver cells, and lead to scarring called cirrhosis. Long-term heavy use of alcohol also may give you alcoholic fatty liver disease, a sign that your liver doesn’t work as well as it should.

      Heart Disease
      You may know about the dangers of blood clots and high levels of fats and cholesterol in your body. Alcohol makes both things more likely. Studies of heavy drinkers also show that they are more likely to have trouble pumping blood to their heart and may have a higher chance of dying from heart disease.

      Brain and Nervous System Problems
      Alcohol affects the brain’s communication pathways. This makes it harder for you to think and speak clearly, remember things, make decisions, and move your body. Heavy drinking also can cause mental health issues like depression and dementia. You may get painful nerve damage that may linger long after you sober up.

      Anemia
      This is when your body doesn’t make enough healthy red blood cells to move oxygen around. That may give you ulcers, inflammation, and other problems. Too much booze may also make you more likely to skip meals, which can short-change your body of iron.

      Cancer
      There is a clear link between heavy alcohol use and many types of cancers. Alcohol can damage the cells in your mouth, throat, voice box, and esophagus. It can lead to cancers in your liver, breast, and intestines. Alcohol can help cancer-causing chemicals in tobacco and other sources enter your cells more easily.
      ###
      Worry: Lead Paint
      Article:
      Lead is a highly toxic metal that may cause a range of health problems, especially in young children. When lead is absorbed into the body, it can cause damage to the brain and other vital organs, like the kidneys, nerves, and blood.

      Lead may also cause behavioral problems, learning disabilities, seizures, and in extreme cases, death. Some symptoms of lead poisoning may include headaches, stomachaches, nausea, tiredness, and irritability. Children who are lead poisoned may show no symptoms.

      Both inside and outside the home deteriorated lead-paint mixes with household dust and soil and becomes tracked in. Children may become lead poisoned by:

      Putting their hands or other lead-contaminated objects into their mouths,
      Eating paint chips found in homes with peeling or flaking lead-based paint, or
      Playing in lead-contaminated soil
      ###
      Worry: ${worry}
      Article:
      `,
      700,
    );

  const fetchTitle = (openai: OpenAI, confirmation: string) =>
    completePrompt(
      openai,
      `Create a short, worrisome article title based on the following article: ${confirmation}`,
      30,
      0.4,
    );

  const fetchImagePrompt = (openai: OpenAI, title: string, article: string) =>
    completePrompt(
      openai,
      `Give a short description of an image that could be used to describe an article based on a title and its article. The description should be rich in visual details but contain no names.
      ###
      title: "Dangers of Overflossing: Is it Possible to Floss Too Much?"
      article: Flossing your teeth is essential for maintaining proper oral hygiene, but is it possible to overdo it? You may be surprised to learn that flossing might actually become a potential problem if done in excess. Flossing too frequently or in a manner that is too aggressive can cause serious damage to your gums and teeth. In some cases, it can cause receding gums, inflamed gums and tenderness. Overflossing can also damage tooth enamel and lead to cavities. It’s important to be mindful of how you floss your teeth, as improper techniques can result in injury, pain and other complications. Flossing too hard, sawing back and forth, or going too deep between the teeth can damage your gums and teeth. Since this activity requires such precision and skill, it’s best to talk to your dentist before you start flossing your teeth, and follow their instructions. They can let you know the proper technique and frequency for flossing. Your dentist should provide you with a demonstration of the best way to floss your teeth and explain the potential repercussions of doing it wrong. This is particularly important for those with braces — improper flossing can damage the bands that hold the wires in place. It’s never a bad idea to ask questions. Your dentist will be able to answer any questions you have in detail and provide you with any additional information you may need. It’s always better to be safe than sorry. Your question is a good one, and you are not overreacting. Flossing, when done properly, is good for your oral health, but it is important to be aware of the potential risks and take the necessary precautions to ensure a safe and healthy mouth.

      image description: A worried mom stand in the bathroom holding a cell phone. She is comforting her daughter who has inflamed her gums by overflossing.
      ### 
      title: "Beware of Papercuts: A Hidden Danger Lurking in Plain Sight"
      article: Papercuts. The mere thought of them strikes fear into the hearts of many. From the sharp pain of slicing your skin with a paper to the possibility of infection, papercuts can quickly take a normal, mundane activity and turn it into a potential disaster. While papercuts may appear to be innocent, they can actually be quite dangerous. Papercuts are highly susceptible to infection because the paper fibers act as sponges, soaking up bacteria in the air. If the cut is deep enough, the bacteria can penetrate the skin and cause a dangerous bacterial infection. Moreover, papercuts tend to bleed longer and profusely due to the jagged cut and typically deeper wound from paper edges. It is also a common misconception that paper is clean. The truth is that paper can contain any kind of bacteria, from various viruses to salmonella. This means that when you receive a papercut, you are potentially at risk for an infection from anything that is on the paper. So while a papercut may appear minor, there is always a potential for a bigger problem. If you receive a papercut, be sure to thoroughly clean and disinfect the wound with soap and water and a mild antibacterial ointment. Keep the wound covered until it is completely healed, and make sure to keep an eye out for signs of infection such as redness, swelling, and fever. Your fear is a reasonable one – don’t let anyone tell you otherwise. Papercuts may seem like an insignificant danger, but they can quickly turn into something more serious depending on the circumstances. So take caution when handling paper and make sure to practice proper wound care.
      image description: A worried woman sits in the back of an ambulance. She has a papercut on her finger and is being treated by a paramedic.
      ###
      title: "The Risks of Job Loss: Financial and Emotional Consequences"
      article: Losing your job can be a frightening and disruptive experience. Not only does it mean a lack of income, it could cause a variety of other potential problems, some of which may be difficult to anticipate. Your first thought may be of the financial risk associated with losing a job. Without a steady income, it can become increasingly difficult to pay for necessary expenses such as rent, utilities, food, and health insurance. It may then be necessary to dip into savings accounts in order to cover these basic needs until you’re able to secure new employment. But financial hardship is only one part of the equation. Studies have shown a direct link between job security and mental health. After all, a job can be much more than a paycheck; it’s also a source of identity, purpose, and social support. Therefore, it’s not uncommon for someone to experience heightened feelings of anxiety or depression after losing their job. In some cases, those emotions may be so overwhelming that they negatively impact physical well-being. Receiving support from family and friends is one way to help cope with these feelings. It’s also important to take advantage of available resources, such as unemployment benefits, counseling services, and job search assistance, to help manage the risk associated with job loss. It’s understandable to feel apprehensive about the potential problems that come with losing your job. It’s a risky situation, to be sure, but with the right support and resources, you can move forward and begin planning for a brighter future.
      image description: A sad man packs up his desk in a cardboard box, looking defeated. A "Now Hiring" sign is visible in the background.
      ###
      title: ${title}
      article: ${article}
      image description:
      `,
      100,
      0.8,
    );

  const generateImage = async (openai: OpenAI, prompt: string) => {
    const result = await openai.images.generate({
      model: imageModel,
      prompt,
      size: '1024x1024',
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      throw new Error('No image returned');
    }

    return `data:image/png;base64,${imageBase64}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const openai = createOpenAIClient(apiKey.trim());

    try {
      resetGeneratedData();

      void (async () => {
        try {
          const commentary = await fetchBotCommentary(openai);
          if (commentary) {
            setBotCommentary(commentary);
          }
        } catch {
          // Commentary is optional; a failure should not block the rest.
        }
      })();

      const nextConfirmation = await fetchConfirmation(openai);
      if (!nextConfirmation) throw new Error('No confirmation returned');
      setConfirmation(nextConfirmation);

      const nextTitle = await fetchTitle(openai, nextConfirmation);
      if (!nextTitle) throw new Error('No title returned');
      setTitle(nextTitle);

      const imagePrompt = await fetchImagePrompt(
        openai,
        nextTitle,
        nextConfirmation,
      );
      if (!imagePrompt) throw new Error('No image prompt returned');

      const nextImage = await generateImage(openai, imagePrompt);
      setImage(nextImage);
    } catch {
      resetGeneratedData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <header>
        <h1>{`Yes, It's a Problem 👍`}</h1>
      </header>

      <p className="commentary-callout">🤖 "{botCommentary}"</p>

      <section aria-label="Check your problem">
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="problem">What are you worried about?*</label>
            <input
              id="problem"
              type="text"
              placeholder={problemPlaceholder}
              value={worry}
              required
              onChange={(event) => setWorry(event.target.value)}
            />
          </p>

          <p>
            <label htmlFor="openai-key">Your OpenAI API key*</label>
            <input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              required
              autoComplete="off"
              onChange={(event) => setApiKey(event.target.value)}
            />
          </p>

          <p>
            <button disabled={worry === '' || apiKey === ''} type="submit">
              Check my problem!
            </button>
          </p>
        </form>
      </section>

      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading">Example problems</h2>
        <p>
          <button type="button" onClick={() => loadDemo(paperCutDemo)}>
            Paper Cut 🩸
          </button>
          <button type="button" onClick={() => loadDemo(missingFlightDemo)}>
            Missing Flight ✈️
          </button>
          <button type="button" onClick={() => loadDemo(publicSpeakingDemo)}>
            Public Speaking 📣
          </button>
          <button type="button" onClick={clearState}>
            Clear
          </button>
        </p>
      </section>

      {isLoading ? (
        <p role="status" aria-live="polite" aria-busy="true">
          <img className="spinner" src={spinner} alt="loading..." />
        </p>
      ) : (
        [confirmation, title, image].every((item) => item.length) && (
          <article>
            <header>
              <h2>{title}</h2>
            </header>
            <figure>
              <img className="image" alt={title} src={image} />
            </figure>
            <p className="confirmation">{confirmation}</p>
          </article>
        )
      )}

      <footer>
        <p>
          {`This website is for entertainment only. It does not give real advice
          you should follow.`}{' '}
          <a href="https://github.com/jwworth/yes-its-a-problem">Source code</a>
        </p>
      </footer>
    </main>
  );
};

export default App;
