---
title: "My View on Design Engineering"
subtitle: "and the tasks nobody owns"
date: 2026-08-18
category: "design"
aiDisclosure: true
description: "My take on what a design engineer does, and why keeping a product consistent is the hard part now."
---

“Design engineer” is a fairly new job title, and there isn’t a definition everyone agrees on yet.[^1]
Ask a few people and you get a few different answers. A designer who can code. A frontend developer
with an eye for detail. Someone who sits somewhere between design and development, whatever that
means in practice.

<figure class="figure-block figure-block--sm">
<svg class="figure" viewBox="0 0 487 111" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three circles: one drawn as a dashed outline, one half dashed and half solid, one solid."><defs><filter id="fig-role" x="-14%" y="-14%" width="128%" height="128%" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="81" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/></filter></defs><g filter="url(#fig-role)" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="55.5" cy="55.5" r="54" stroke-dasharray="10 8"/><path d="M243.5,1.5 A54,54 0 0 0 243.5,109.5" stroke-dasharray="10 8"/><path d="M243.5,1.5 A54,54 0 0 1 243.5,109.5"/><circle cx="431.5" cy="55.5" r="54"/></g><g opacity="0.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M127.5,55.5 H171.5"/><path d="M134.5,49.5 L127.5,55.5 L134.5,61.5"/><path d="M164.5,49.5 L171.5,55.5 L164.5,61.5"/></g><g opacity="0.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M315.5,55.5 H359.5"/><path d="M322.5,49.5 L315.5,55.5 L322.5,61.5"/><path d="M352.5,49.5 L359.5,55.5 L352.5,61.5"/></g></svg>
</figure>

None of those are wrong. They’re just descriptions of a person, and I don’t think a person
is the interesting part. The role is: there is a specific set of tasks that has to be done in every
digital product, and on most teams nobody is responsible for them.

## Consistency is more important than ever

> When writing code stops being the bottleneck, coherence becomes the bottleneck.

Most of this work happens on products that already exist. Not all of it, but most: something that
has been running for a few years, with a backlog, a team that has changed twice, and a codebase
nobody has read all of. New products get there faster than they used to. A couple of months in, and
there is already a history to be consistent with.

What changed is the pace. When a change took a while to build, that time did some of the work for
you, because to extend something you had to go and look at what was already there. Generated code
skips that step. It reads well, it looks right, and it tends to know nothing about what sits next
to it. Every new feature makes sense on its own, and so does every small change inside one. That’s
the problem. Nothing is wrong anywhere in particular, and the product still falls apart.

So you get four kinds of button, three date formats and two competing ideas about what the color
blue means. Spacing that is close but not the same. A panel that slides in on one page and fades in
on the next, because two different people, or two different prompts, each made a reasonable choice.

<figure class="figure-block">
<svg class="figure" viewBox="0 0 600 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four Save buttons, each with a different corner radius, height and stroke weight."><defs><filter id="fig-drift" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2"/></filter><pattern id="fig-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="1.1" stroke-opacity="0.22"/></pattern></defs><g filter="url(#fig-drift)" stroke="currentColor" stroke-width="2"><rect x="20" y="30" width="110" height="40" rx="4" fill="none"/><rect x="150" y="28" width="120" height="44" rx="22" fill="url(#fig-hatch)"/><rect x="290" y="32" width="105" height="36" rx="2" fill="none"/><rect x="415" y="27" width="125" height="46" rx="10" fill="currentColor" fill-opacity="0.10"/></g><text x="75.0" y="55" text-anchor="middle">Save</text><text x="210.0" y="55" text-anchor="middle">Save</text><text x="342.5" y="55" text-anchor="middle">Save</text><text x="477.5" y="55" text-anchor="middle">Save</text></svg>
<figcaption>Each one was a reasonable choice on the day it was made.</figcaption>
</figure>

Mechanical engineers have a name for this. A _tolerance stack-up_ is when every part in an assembly
is within spec and the whole thing still doesn’t fit, because all the small allowances happened to
lean the same way. Nobody made a mistake. It just adds up.[^2]

This is what a design system is for, and I think it usually gets explained badly. People picture a
component library, which is only one of the parts. In practice it’s a set of tools and methods that
have to work together: the components, design tokens, written guidelines, and now the context files
and agent skills that tell the AI writing the code what the rules already are. That list keeps
changing, and keeping it current is part of the job. Together they do two things. They give guidance
where somebody has to make a decision, and they put guardrails around the decisions that get made
without anyone noticing. That’s how consistency survives any single person on the team and any
single prompt.

Consistency isn’t something a team can own as a group. You can ask everyone to care about it, and
everyone can care about it, and the product will still drift (see _tolerance stack-up_). It’s a job.
And from my point of view a job for a designated design engineer.

## Details make a product a good product

> The product is the source of truth, not the design files.

Consistency is not the only aspect of a good product. You can build a product where every button
matches, every spacing value comes from the same scale, nothing contradicts anything, and the whole
thing is still lifeless and unpleasant to use. Coherence is the foundation and the role as a design
engineer doesn't stop here.

This is the part people feel: animations, transitions, and the _microinteractions_ that tell you an
app noticed what you did. A button reacts when you press it. A menu grows out of the thing you
tapped instead of appearing from nowhere, and a message tells you your work was saved.

None of it comes for free. By default a screen jumps straight from one state to the next. A door in
the real world swings open, it doesn’t teleport, and getting that same feeling on a screen takes
somebody deciding to build it.

<div class="demo">
<svg class="demo-filter" aria-hidden="true" focusable="false"><filter id="demo-scribble" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="23" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/></filter></svg>
<input type="radio" name="mi-a" id="a-none" class="demo-radio demo-radio-a" checked><input type="radio" name="mi-a" id="a0" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a1" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a2" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a3" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a4" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a5" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a6" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a7" class="demo-radio demo-radio-a"><input type="radio" name="mi-a" id="a8" class="demo-radio demo-radio-a"><input type="radio" name="mi-b" id="b-none" class="demo-radio demo-radio-b" checked><input type="radio" name="mi-b" id="b0" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b1" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b2" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b3" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b4" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b5" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b6" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b7" class="demo-radio demo-radio-b"><input type="radio" name="mi-b" id="b8" class="demo-radio demo-radio-b">
<div class="demo-screens">
<div><span class="demo-cap">Static</span><div class="demo-grid demo-grid--snap"><label for="a-none" class="demo-close" aria-label="close"></label><label for="a0" class="demo-cell cell-0" style="--c:0;--r:0"><span class="demo-num">1</span></label><label for="a1" class="demo-cell cell-1" style="--c:1;--r:0"><span class="demo-num">2</span></label><label for="a2" class="demo-cell cell-2" style="--c:2;--r:0"><span class="demo-num">3</span></label><label for="a3" class="demo-cell cell-3" style="--c:0;--r:1"><span class="demo-num">4</span></label><label for="a4" class="demo-cell cell-4" style="--c:1;--r:1"><span class="demo-num">5</span></label><label for="a5" class="demo-cell cell-5" style="--c:2;--r:1"><span class="demo-num">6</span></label><label for="a6" class="demo-cell cell-6" style="--c:0;--r:2"><span class="demo-num">7</span></label><label for="a7" class="demo-cell cell-7" style="--c:1;--r:2"><span class="demo-num">8</span></label><label for="a8" class="demo-cell cell-8" style="--c:2;--r:2"><span class="demo-num">9</span></label></div></div>
<div><span class="demo-cap">With transition</span><div class="demo-grid demo-grid--anim"><label for="b-none" class="demo-close" aria-label="close"></label><label for="b0" class="demo-cell cell-0" style="--c:0;--r:0"><span class="demo-num">1</span></label><label for="b1" class="demo-cell cell-1" style="--c:1;--r:0"><span class="demo-num">2</span></label><label for="b2" class="demo-cell cell-2" style="--c:2;--r:0"><span class="demo-num">3</span></label><label for="b3" class="demo-cell cell-3" style="--c:0;--r:1"><span class="demo-num">4</span></label><label for="b4" class="demo-cell cell-4" style="--c:1;--r:1"><span class="demo-num">5</span></label><label for="b5" class="demo-cell cell-5" style="--c:2;--r:1"><span class="demo-num">6</span></label><label for="b6" class="demo-cell cell-6" style="--c:0;--r:2"><span class="demo-num">7</span></label><label for="b7" class="demo-cell cell-7" style="--c:1;--r:2"><span class="demo-num">8</span></label><label for="b8" class="demo-cell cell-8" style="--c:2;--r:2"><span class="demo-num">9</span></label></div></div>
</div>
<figcaption>Tap a tile in either grid, and again to close it. Both open the same thing, but only one of them tells you where it came from.</figcaption>
</div>

The same goes for everything a design file leaves out. A file shows a product at its best. One
screen width, plausible data that someone made up, and the path where everything goes right.
Shipping that same screen means answering a much longer list of questions. What happens with a name
that’s sixty characters long? Does the layout jump around when the data finally loads? What if there
is no data at all, and is that an empty state or does it look like something broke? What about a
slow connection, a narrow phone, someone who never touches a mouse? More and more often there is no
design file to begin with. A feature goes from a sentence to something running, and all of those
questions still arrive at once, with nobody having thought about them first.

They get answered either way. Usually by whoever is holding the code at the time, near the end of a
sprint, in the fastest way available. Which is fair enough. It was never really their call to make.
It should be the call of a design engineer.

## Two definitions of done

Designers and developers look at the same work from different places. Both have a definition of
“done”, and the two definitions aren’t the same.

Done, for a developer: it works, it’s tested, it’s fast, it didn’t break anything else. Done, for a
designer: it behaves the way it was meant to behave and it looks good.

They don’t use the same words either. The same feature gets described twice, in two vocabularies,
and both descriptions are right.

What helps is somebody who speaks both. Somebody who knows what each side worries about and what
each side judges the work by, and who can give the two of them a shared vocabulary to work in.

One more thing I’ve noticed, and can’t explain. The craft you came from first seems to stick to you.
A developer who gets good at design is called well-rounded. A designer who learns to build gets
asked whether they can _really_ engineer. Same skills, opposite reaction. I don’t know why that
difference gets made, or whether it goes away as more people end up doing both.[^3]

## And then there’s taste, which is a horrible word

It sounds like snobbery. It sounds like someone in an expensive chair explaining why the thing you
like is bad. I’ve been looking for a better word for a while and haven’t found one, so I’m going to
use this one and try to be precise about what I mean by it.

Taste isn’t knowing what’s good. Most people know what’s good. Taste is what you do when there are
ten options in front of you and all of them are acceptable. It’s being able to say no to something
that is _fine_.

It’s also the part of consistency you can’t write down. A rule can say that every dialog closes the
same way. It can’t tell you that the one deleting someone’s work should be slower, or heavier, or
ask twice. Every good product breaks its own rules somewhere, and no rule can tell you where.

Think about two apps that do exactly the same thing, where one of them feels noticeably better and
you can’t explain why. You can’t point at the feature responsible, because there isn’t one. It’s the
sum of a few hundred small decisions, none of which would survive being written down as a
requirement. That’s the awkward thing about this part of the work: people register it reliably and
can rarely name it, which makes it hard to argue for and easy to cut.

I think this is the part that’s becoming more valuable, though not quite for the reason people
usually give. Producing something that looks like a working interface has been getting cheaper for a
long time and continues to. Design is worth no less for it. The difficulty has just moved. When
making things is cheap, the expensive skill is choosing: deciding which of the ten acceptable
versions ships, and being willing to throw away nine that would have been fine.[^4]

## Conclusion

So, a definition. A design engineer is the person who owns whether a product still agrees with
itself. In a design file, everything agrees. In a component library, everything agrees. You only
find out in the running product, where the pieces sit next to each other. And part of the job is
knowing which patterns to break.

I don’t think that has to be a job title. If your team already has someone doing this work without a
name for it, that’s the good outcome, and the label would just be paperwork. The title is
only useful because it makes the work visible enough to plan for and to hire for.

I also don’t think anyone holds all of this at the same level. The people who describe this role well
tend to be describing a team, not a person.[^5]

Keeping a product coherent is the part that gets talked about. The harder half is deciding what’s
worth being coherent about. Ask me again in two years and I’ll probably have rewritten all of this.

[^1]:
    Not a new title in mechanical engineering, where a design engineer is the one answerable for
    whether a part can actually be built.
    [Thread in r/MechanicalEngineering](https://www.reddit.com/r/MechanicalEngineering/comments/d84vg6/what_is_a_design_engineer/)

[^2]:
    Tolerance stack-up is a standard problem in mechanical design: the accumulated effect of the
    variation that each individual dimension is allowed. The version I’m describing is the worst
    case, where every part sits at its tolerance limit in the same direction at once.
    [Tolerance analysis](https://en.wikipedia.org/wiki/Tolerance_analysis)

[^3]:
    This observation isn’t mine. It came up on
    [Syntax #1027](https://syntax.fm/show/1027/the-rise-of-the-design-engineer/transcript).

[^4]:
    I keep a note in my [digital garden](/garden/design/taste) collecting things other people have
    written about taste. The line that stuck with me most: “the question is no longer ‘can it be
    made?’ but ‘is it worth making?’”

[^5]:
    Vercel’s write-up on design engineering makes this explicit: no individual is expected to have
    every skill the team collectively brings.
    [vercel.com/blog/design-engineering-at-vercel](https://vercel.com/blog/design-engineering-at-vercel)
